import { ProjectFormData } from "@/app/types/interfaces";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { SetStateAction, useState } from "react";

type Props = {
    onCreate: (newProject: ProjectFormData) => void;
    toast: any;
};

export default function CreateProjectButton({ toast, onCreate }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const createProject = () => {
        setIsLoading(true);
        fetch("/api/dashboard/save-tfg", {
            method: "POST",
            cache: "no-store",
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    toast.success("Proyecto creado");
                    onCreate(json.response);
                } else {
                    toast.error(json.response);
                }
            })
            .catch((e) => {
                console.log(e);
                toast.error("Algo ha ido mal");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Button onClick={createProject} className="px-10 rounded-full w-48 max-w-full" color="primary">
            {isLoading ? <Spinner color="white" size="sm" /> : <>Crear proyecto</>}
        </Button>
    );
}
