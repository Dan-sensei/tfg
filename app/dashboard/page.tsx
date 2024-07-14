import { IconHomeFilled } from "@tabler/icons-react";

export default function Dashboard() {
    return (
        <div className="flex flex-col self-strech gap-3 w-full items-center justify-center bg-grid">
            <IconHomeFilled className="opacity-40" size={100} />
            <h1 className="text-3xl uppercase text-nova-gray">Bienvenido</h1>
        </div>
    );
}
