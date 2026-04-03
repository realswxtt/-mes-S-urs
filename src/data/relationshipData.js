export const relationshipData = {
    startDate: "2025-05-29T00:00:00", // El día que todo empezó (Nuestra primera cita)
    hero: {
        title: "Iris & Jose",
        subtitle: "Donde el destino se vuelve realidad.",
        backgroundImage: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2000&auto=format&fit=crop",
    },
    timeline: [
        {
            id: 1,
            title: "Nuestra primera cita",
            date: "29 de Mayo",
            description: "Caminamos juntos por primera vez y supimos que esto era especial.",
            image: "/assets/timeline/cita.png"
        },
        {
            id: 2,
            title: "Nuestro primer beso",
            date: "12 de Junio",
            description: "El momento donde el tiempo se detuvo y nos unimos por siempre.",
            image: "/assets/timeline/beso.png"
        },
        {
            id: 4,
            title: "Nuestro primer viaje",
            date: "24 de Abril",
            description: "Rumbo a Lima, nuestra primera gran aventura juntos. Haz click para ver el plan.",
            image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop",
            link: "/nuestro-viaje"
        },
    ],
    gallery: [
        { url: "/assets/gallery/foto1.png", title: "", description: "" },
        { url: "/assets/gallery/foto2.png", title: "", description: "" },
        { url: "/assets/gallery/foto3.png", title: "", description: "" },
        { url: "/assets/gallery/foto4.png", title: "", description: "" },
        { url: "/assets/gallery/foto5.png", title: "", description: "" }
    ],
    messages: [
        { sender: "Él", text: "¿Te acuerdas de ese primer día?", time: "10:00 AM" },
        { sender: "Ella", text: "Como si fuera ayer. Estaba tan nerviosa...", time: "10:01 AM" },
        { sender: "Él", text: "Yo no podía dejar de sonreír. Sabía que eras tú.", time: "10:02 AM" },
        { sender: "Ella", text: "Y aquí estamos, escribiendo nuestro propio universo.", time: "10:03 AM" },
    ]
};
