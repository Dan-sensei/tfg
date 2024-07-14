import { Social, SocialsSchema } from "../lib/schemas";
import {
    IconBrandDiscordFilled,
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandX,
    IconBrandYoutubeFilled,
    IconLink,
} from "@tabler/icons-react";

export const socialsWithIcon: Record<Social, { icon: JSX.Element; value: string | null; name: string; placeholder: string }> = {
    [Social.github]: { icon: <IconBrandGithub />, name: "Github", value: null, placeholder: "https://github.com/..." },
    [Social.linkedin]: { icon: <IconBrandLinkedin />, name: "Linkedin", value: null, placeholder: "https://www.linkedin.com/..." },
    [Social.youtube]: { icon: <IconBrandYoutubeFilled />, name: "Youtube", value: null, placeholder: "https://www.youtube.com/..." },
    [Social.twitter]: { icon: <IconBrandX />, name: "Twitter", value: null, placeholder: "https://x.com/..." },
    [Social.discord]: { icon: <IconBrandDiscordFilled />, name: "Discord", value: null, placeholder: "usuario" },
    [Social.facebook]: { icon: <IconBrandFacebook />, name: "Facebook", value: null, placeholder: "https://www.facebook.com/..." },
};
