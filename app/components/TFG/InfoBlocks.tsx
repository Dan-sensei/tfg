import { BLOCKSCHEMA, DetailsProps } from "../TFG_BlockDefinitions/BlockDefs";

export default function InfoBlocks({ blocks }: DetailsProps) {
    return (
        <div className="max-w-screen-2xl mx-auto xl:pt-10">
            {blocks.map((c, i) => {
                const BlockTypeComponent = BLOCKSCHEMA[c.type];
                if (!BlockTypeComponent || BlockTypeComponent.expectedParameters > c.params.length) {
                    console.error("Blocktype component not found or missing params (InfoBlocks)");
                    return null;
                }
                const Element = BlockTypeComponent.element;
                return (
                    <section key={i} className="pt-10">
                        <Element key={c.type} params={c.params} />
                    </section>
                );
            })}
        </div>
    );
}
