'use client';

import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import PostCard from './PostCard';
import { PostNode } from '../data/categories';
import { useEffect, useState } from 'react';
import FacebookVideoPlayer from "./FBVideoPlayer";
import YouTubePlayer from "./YTVideoPlayer";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Masonry = dynamic(() => import('@mui/lab/Masonry'), {
    ssr: false,
});

const DummyPosts: PostNode[] = [
    {
        title: "Anti-tilt drill guaranteed straight",
        sourceId: "facebook",
        sourceUrl: "https://www.facebook.com/reel/986282963734058",
        content: `
- Attach the spirit level to the drill bit.
- Place the drill in a flat position.
- Glue the spirit level to the back of the drill.
  `,
        categoryPath: ["Home", "DIY"],
        images: {
            thumbnail: "/demo-images/videoframe_1901.png",
            before: "/demo-images/Screenshot 2026-05-25 at 12.10.57.png",
            after: "/demo-images/Screenshot 2026-05-25 at 12.11.26.png",
        },
        votes: 7634,
    },
    {
        title: "Junction between two different pipes size with bolt and nuts",
        sourceId: "facebook",
        sourceUrl: "https://www.facebook.com/reel/1517623153036583",
        maxSeconds: 4,
        content: `
- Measure and confirm both pipe sizes.
- Select the correct reducer flange or adapter fitting.
- Align the two pipe flanges properly.
- Insert gasket, bolts, and nuts into the flange connection.
- Tighten bolts evenly in a crisscross pattern and check for leaks.
    `,
        categoryPath: ["Home", "Wastafel"],
        images: {
            thumbnail: "/demo-images/videoframe_1901.png",
            before: "/demo-images/before.png",
            after: "/demo-images/after.png",
        },
        votes: 3453,
    },
    {
        title:
            "The rear wheel is producing a rough grinding noise while driving, especially at low speeds and during acceleration",
        sourceId: "youtube",
        sourceUrl: "https://youtube.com/embed/-FZRIvgqdvY?si=UYoxsBVbPNqxyCpd",
        content: `
- Rear wheel produces a rough grinding noise while driving
- Noise is more noticeable at low speeds and during acceleration  
- Vehicle feels weaker than usual when pulling or accelerating  
- Feels like there is extra resistance coming from the rear side  
- Please inspect the entire rear wheel assembly thoroughly  
   `,
        categoryPath: ["Motorcycle", "Maintenance"],
        images: {
            thumbnail: "/demo-images/videoframe_1901.png",
            before: "/demo-images/Screenshot 2026-05-25 at 10.32.33.png",
            after: "/demo-images/Screenshot 2026-05-25 at 10.40.21.png",
        },
        votes: 145,
    },
    {
        title:
            "Traditional herbal remedies for fertility and accelerating pregnancy",
        sourceId: "facebook",
        sourceUrl: "https://www.facebook.com/reel/962107376598484",
        content: `
1. Clean and bruise 2 knuckles of ginger
2. Add 1 turmeric and 2 stalks of lemongrass to a pot with water
3. Boil for 5-10 minutes then pour the warm mixture
4. Add 1 tablespoon of lime juice
5. Repeat for 3 consecutive days every morning on an empty stomach
  `,
        categoryPath: ["Health", "Herbal Remedies"],
        images: {
            thumbnail: "/demo-images/videoframe_1901.png",
            before: "/demo-images/Screenshot 2026-05-25 at 11.26.14.png",
            after: "/demo-images/Screenshot 2026-05-25 at 11.26.34.png",
        },
        votes: 32,
    },
    {
        title: "Galangal chicken with bajaj chili sauce",
        sourceId: "facebook",
        sourceUrl: "https://www.facebook.com/reel/1471326694180760",
        content: `
#### Blender
- 15 cm galangal
- 6 shallots
- 1 stalk lemongrass

#### In a Bowl, Add
- 500 g chicken
- 1 sachet Desaku marinade
- 1 sachet Desaku garlic powder
- 1 tsp Lalapan pepper powder
- 1/2 tbsp granulated sugar
- The previously blended spices (galangal, lemongrass, and shallots)

#### Instructions
1. Mix all ingredients evenly.
2. Steam for 10 minutes.
3. Fry until fully cooked.
  `,
        categoryPath: ["Cooking", "Recipes", "Chicken"],
        images: {
            thumbnail: "/demo-images/videoframe_1901.png",
            before: "/demo-images/Screenshot 2026-05-25 at 11.45.35.png",
            after: "/demo-images/Screenshot 2026-05-25 at 11.45.44.png",
        },
        votes: 432,
    },
];

function VideoPlayer({ sourceId, sourceUrl }: { sourceId: string, sourceUrl: string }) {
    switch (sourceId) {
        case "facebook":
            return <FacebookVideoPlayer videoUrl={sourceUrl} />;
        case "youtube":
            return <YouTubePlayer videoUrl={sourceUrl} autoPlay={false} />;
        default:
            return <img src={sourceUrl} className="w-full h-full object-cover" />;
    }
}

export default function PostList() {
    const [mounted, setMounted] = useState(false);
    const [play, setPlay] = useState(false);
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (post) {
            setPlay(true);
        }
    }, [post]);

    if (!mounted) return null;

    const onPlayHandler = (post: any) => {
        setPost(post);
    }

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Masonry
                    columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
                    spacing={{ xs: 0, sm: 2, md: 2, lg: 2, xl: 3 }}
                >
                    {DummyPosts.map((post, idx) => (
                        <div key={idx}>
                            <Box sx={{ paddingBottom: { xs: 2, sm: 0, md: 0, lg: 0, xl: 0 } }}>
                                <PostCard post={post} onPlay={onPlayHandler} />
                            </Box>
                        </div>
                    ))}
                </Masonry>
            </Box>

            <Modal
                open={play}
                onClose={() => setPlay(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="fixed flex justify-center items-center w-full h-full top-0 left-0 right-0 bottom-0 bg-black/50">
                    <Box
                        sx={{
                            height: { xs: "90vh", sm: "90vh", md: "90vh" },
                            aspectRatio: "9 / 16",
                            position: "relative",
                            overflow: 'hidden',
                            padding: 5,
                        }}
                    >
                        <Box className="absolute -top-0 -right-0 z-10 bg-black/50 hover:bg-black/70 rounded-full">
                            <IconButton onClick={() => setPlay(false)}>
                                <CloseIcon className="text-white w-6 h-6" />
                            </IconButton>
                        </Box>

                        {post && <VideoPlayer sourceId={post.sourceId} sourceUrl={post.sourceUrl} />}
                    </Box>
                </Box>
            </Modal>
        </>
    );
}