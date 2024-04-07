export default async function PaddingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pt-[66px] lg:pt-[87px] px-4 xl:px-14 h-full">{children}</div>
    );
}
