"use client";
import { BasicButton, HeadlessComplete, InfoButton } from "@/app/lib/headlessUIStyle";
import { Social, SocialsSchema, SocialsType, UserProfileSchema } from "@/app/lib/schemas";
import { isNullOrEmpty } from "@/app/utils/util";
import { Button, Checkbox, Field, Input, Label } from "@headlessui/react";
import { IconCheck, IconLink } from "@tabler/icons-react";
import clsx from "clsx";
import { produce } from "immer";
import { useEffect, useState } from "react";
import * as v from "valibot";
import { Spinner } from "@nextui-org/spinner";
import TFG_BasicInfo from "@/app/components/TFG/BasicInfo";
import { useSession } from "next-auth/react";
import { iDetailsTFG, iTFG } from "@/app/types/interfaces";
import { DEF_BANNER, MAX_SOCIAL_LINK_LENGTH } from "@/app/types/defaultData";
import { socialsWithIcon } from "@/app/types/defaultComponents";
import SocialInput from "./socialInput";
import { useToast } from "@/app/contexts/ToasterContext";

const getSocialValues = (socialWithIcon: Record<Social, { icon: JSX.Element; value: string | null }>) => {
    return Object.keys(socialsWithIcon).reduce((acc, key) => {
        acc[key as Social] = socialWithIcon[key as Social].value;
        return acc;
    }, {} as SocialsType);
};

export default function Profile() {
    const { data: session } = useSession();
    const [socials, setSocials] = useState<SocialsType>(getSocialValues(socialsWithIcon));
    const [showImage, setShowImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [personalPage, setPersonalPage] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetch("/api/dashboard/user-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setShowImage(data.response.showImage);
                    setPersonalPage(data.response.personalPage);
                    if (!isNullOrEmpty(data.response.socials)) {
                        let parsedSocials: SocialsType;
                        try {
                            parsedSocials = JSON.parse(data.response.socials);
                            setSocials(parsedSocials);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                setFailed(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const saveSocials = () => {
        const validateResult = v.safeParse(UserProfileSchema, {
            showImage,
            socials,
            personalPage,
        });
        if (!validateResult.success) return;
        setLoading(true);
        fetch("/api/dashboard/user-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validateResult.output),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    toast.success("Cambios guardados correctamente");
                } else {
                    toast.error("No se pudieron guardar los cambios");
                }
            })
            .catch((err) => {
                toast.error("No se pudieron guardar los cambios");
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    if (failed) {
        return (
            <main className="w-full p-5 bg-gray-900 border-white/5 border-1 rounded-lg flex items-center justify-center">
                No se han podido recuperar los datos
            </main>
        );
    }

    const displayTFG: iDetailsTFG = {
        id: 0,
        title: "Titulo",
        thumbnail: DEF_BANNER,
        description: "Descripción",
        banner: DEF_BANNER,
        views: 0,
        score: 0,
        author: [
            {
                name: session?.user.name || "Usuario",
                image: session?.user.image ?? "",
                socials: JSON.stringify(socials),
                personalPage: personalPage,
                showImage: showImage,
            },
        ],
        tutors: [{ name: "Tutor", image: "" }],
        department: null,
        contentBlocks: "[]",
        pages: 0,
        documentLink: "",
        tags: ["tag1", "tag2"],
        createdAt: new Date(),
        college: {
            name: "Universidad",
            image: "",
        },
    };

    return (
        <main className="w-full p-5 bg-gray-900 border-white/5 border-1 rounded-lg relative">
            {loading && <Spinner size="md" color="white" className="absolute top-2 right-2 z-10" />}
            <div className="text-3xl">Perfil</div>
            <div className="text-sm text-nova-gray mb-3">Aquí puedes personalizar tus redes. Se actualizarán automáticamente en tu página de proyecto</div>
            <section>
                <Field className={clsx("flex items-center gap-2 px-3 py-3")}>
                    <Checkbox
                        checked={showImage}
                        className={
                            "group hover:cursor-pointer block size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
                        }
                        onChange={(e) => {
                            setShowImage(e);
                        }}>
                        <IconCheck className="hidden size-4 text-black group-data-[checked]:block" />
                    </Checkbox>
                    Mostrar imagen
                </Field>
            </section>
            <section className={clsx("grid grid-cols-1 md:grid-cols-2 gap-1", loading && "opacity-50 pointer-events-none")}>
                {Object.entries(socials).map(([key, value]) => (
                    <SocialInput
                        key={key}
                        value={value}
                        icon={socialsWithIcon[key as Social].icon}
                        name={socialsWithIcon[key as Social].name}
                        placeholder={socialsWithIcon[key as Social].placeholder}
                        setSocials={(newValue) =>
                            setSocials(
                                produce((draft) => {
                                    draft[key as Social] = newValue;
                                })
                            )
                        }
                    />
                ))}
            </section>
            <div className="pt-1">
                <SocialInput
                    value={personalPage}
                    icon={<IconLink />}
                    name={"Página personal"}
                    placeholder={"https://..."}
                    setSocials={(newValue) => setPersonalPage(newValue)}
                />
            </div>
            <div className="pt-2">
                <Button className={clsx(BasicButton, InfoButton, "rounded-md")} onClick={saveSocials}>
                    Guardar
                </Button>
            </div>

            <h2 className="text-lg mt-3">Preview</h2>
            <div className="aspect-wide relative z-0 grid grid-stack max-h-[600px] w-full border-b-[1px] border-b-white/10 mt-1 rounded-lg">
                <div className="hidden z-40 pl-16 pt-12 pb-8 md:grid grid-cols-6 text-shadow-light-dark/20">
                    <div className={`col-span-4 lg:col-span-3 `}>
                        <TFG_BasicInfo TFG={displayTFG} />
                    </div>
                </div>
                <div className="h-full hidden md:block w-full bg-gradient-to-r from-nova-darker-2/80 to-80% z-20"></div>
                <img src={DEF_BANNER} draggable="false" alt={"Preview banner"} className="absolute object-cover z-10 h-full w-full" />
            </div>
            <main className="p-5 bg-dark-grid md:hidden">
                <div className="block md:hidden">
                    <TFG_BasicInfo TFG={displayTFG} />
                </div>
            </main>
        </main>
    );
}
