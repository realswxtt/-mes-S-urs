import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-css';
import gsap from 'gsap';
import { X, Maximize2, Plus, Loader2, Camera, Trash2 } from 'lucide-react';
import { relationshipData } from '../data/relationshipData';
import { useAuth } from '../context/AuthContext';

const PremiumGallery = () => {
    const [selectedImg, setSelectedImg] = useState(null);
    const [dbImages, setDbImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { user, supabase } = useAuth();
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const fileInputRef = useRef(null);

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    const fetchImages = async () => {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setDbImages(data);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        try {
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('galley')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('galley')
                .getPublicUrl(filePath);

            // 3. Save to Database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert([
                    {
                        url: publicUrl,
                        uploader_id: user.id,
                        title: '',
                        description: ''
                    }
                ]);

            if (dbError) throw dbError;

            fetchImages();
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir la foto. Asegúrate de que el bucket "galley" tenga las políticas de acceso (RSL) activadas.');
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (id, url, e) => {
        e.stopPropagation();
        if (!window.confirm('¿Quieres borrar esta foto por siempre?')) return;

        await supabase.from('gallery_images').delete().eq('id', id);
        fetchImages();
    };

    const openModal = (img) => {
        setSelectedImg(img);
    };

    const closeModal = () => {
        if (!modalRef.current || !modalContentRef.current) {
            setSelectedImg(null);
            return;
        }
        gsap.to(modalContentRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(modalRef.current, { opacity: 0, duration: 0.3, onComplete: () => setSelectedImg(null) });
    };

    // Combine static and DB images
    const allImages = [...dbImages, ...relationshipData.gallery];

    return (
        <div id="gallery" className="container mx-auto px-4 pb-20">
            <div className="text-center mb-16 px-4 relative">
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Nuestra Galería</h2>
                <div className="w-20 h-px bg-gold mx-auto opacity-50 mb-8" />

                {user && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-gold hover:bg-gold hover:text-black transition-all duration-500"
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            )}
                            <span className="text-[10px] uppercase tracking-widest font-bold">Subir Recuerdo</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                )}
            </div>

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
            >
                {allImages.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="mb-4 relative group cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-white/5"
                        onClick={() => openModal(item)}
                    >
                        <img
                            src={item.url}
                            alt={item.title || 'Recuerdo'}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800'; }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Maximize2 className="text-white/50" size={24} />
                        </div>

                        {/* Delete button if owner */}
                        {user && item.uploader_id === user.id && (
                            <button
                                onClick={(e) => deleteImage(item.id, item.url, e)}
                                className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </Masonry>

            {/* Empty State */}
            {allImages.length === 0 && (
                <div className="text-center py-20 opacity-20 flex flex-col items-center">
                    <Camera size={48} className="mb-4" />
                    <p className="font-serif italic text-xl">Aún no hay fotos en vuestro universo...</p>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImg && (
                <div
                    ref={modalRef}
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl"
                    onClick={closeModal}
                >
                    <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={32} />
                    </button>

                    <div
                        ref={modalContentRef}
                        className="relative max-w-5xl w-full flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImg.url}
                            alt={selectedImg.title}
                            className="max-h-[80vh] w-auto rounded-xl shadow-2xl border border-white/10"
                        />
                        {selectedImg.title && (
                            <h3 className="text-gold font-serif text-2xl mt-8 italic text-center">
                                {selectedImg.title}
                            </h3>
                        )}
                        {selectedImg.description && (
                            <p className="text-white/40 font-sans text-sm mt-2 max-w-md text-center">
                                {selectedImg.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumGallery;
