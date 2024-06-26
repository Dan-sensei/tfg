import { DetailsProps, DetailsTypes } from "@/app/lib/BlockTypes";



export default function InfoBlocks({ blocks }: DetailsProps) {
    
    
    return (
        <div className="max-w-screen-2xl mx-auto xl:pt-10">
            {blocks.map((c, i) => {
                const BlockTypeComponent = DetailsTypes[c.type];
                
                if (!BlockTypeComponent || BlockTypeComponent.expectedParameters != c.content.length) return <></>;

                const Element = BlockTypeComponent.element;
                return (
                    <section key={i} className="pt-10">
                        <Element key={c.type} content={c.content} />
                    </section>
                );
            })}
        </div>
    );
}
