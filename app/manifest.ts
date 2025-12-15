import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Solomon's Finance",
        short_name: "Solomon",
        description: "Take control of your finances with elegant simplicity.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/icon/small",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon/medium",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
