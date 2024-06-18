export default async function PaddingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pt-[73px] lg:pt-24 px-4 xl:px-14 h-full">{children}</div>
    );
}
