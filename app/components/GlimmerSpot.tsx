type Props = {
    classname?: string;
    color: string;
};

export default function GlimmerSpot({ classname, color }: Props) {
    return <div className={`${classname} rounded-full`} style={{backgroundColor: color, boxShadow: `0px 0px 8px ${color}`}}></div>;
}
