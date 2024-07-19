import { BLOCKSCHEMA, DetailsProps } from "../TFG_BlockDefinitions/BlockDefs";

export default function InfoBlocks({ blocks }: DetailsProps) {
    console.log(blocks)
    return (
        <div className="max-w-screen-2xl mx-auto xl:pt-10">
            {blocks.map((c, i) => {
                const BlockTypeComponent = BLOCKSCHEMA[c.type];
                if (!BlockTypeComponent) {
                    console.error("Blocktype component not found or missing params (InfoBlocks)");
                    return null;
                }
                let data: any;
                try {
                    data = JSON.parse(c.data);
                } catch (e) {
                    return null;
                }
                console.log(data)
                const Element = BlockTypeComponent.element;
                return (
                    <section key={i} className="pt-10">
                        <Element key={c.type} data={data} />
                    </section>
                );
            })}
        </div>
    );
}
