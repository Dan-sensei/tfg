import { iFullTFG } from "@/app/types/interfaces";
import Image from "next/image";
import prisma from "@/app/utils/db";
async function getPage(id: number) {
    const tfg = (await prisma.tFG.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            thumbnail: true,
            banner: true,
            title: true,
            description: true,
            author: true,
            tutor: true,
            content: true,
            pages: true,
            documentLink: true,
            tags: true,
            views: true,
            score: true,
            createdAt: true,
        },
    })) as iFullTFG;

    return tfg;
}

export default async function Page({ params }: { params: { id: string } }) {
    const TFG = await getPage(parseFloat(params.id));

    return (
        <div className=" mt-[-100px]">
            <div className="aspect-wide relative z-0">
                <Image
                    src={TFG.banner}
                    draggable="false"
                    alt={TFG.title}
                    fill
                    className="object-cover z-10"
                />
                <div className="h-[70px] w-full absolute left-0 z-10 bottom-0 bg-gradient-to-t from-dark pointer-events-none"></div>
            </div>

            <div className="text-center -mt-8 relative z-10">
                <div className="absolute z-20 right-0 pr-10 -top-11 shadow-2xl">
                    <div className="aspect-file w-32 rounded-xl relative overflow-hidden  border-white border-small">
                        <Image
                            src={TFG.thumbnail}
                            draggable="false"
                            fill
                            className="object-cover"
                            alt="Download"
                        />
                    </div>
                    <div className="text-gray-300 text-lg">
                        Descargar <br /> memoria
                    </div>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="text-5xl font-bold">{TFG.title}</div>
                    <div className="text-3xl font-bold text-gray-400 mt-2">
                        {TFG.author}
                    </div>
                    <div className="text-2xl font-bold text-gray-600 mt-2">
                        Tutor: {TFG.tutor}
                    </div>
                </div>
            </div>
            <section className="p-6 pt-16">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem
                magnam libero sequi qui itaque, iure officiis accusamus, saepe
                blanditiis fugit voluptatum accusantium laborum eveniet
                similique? Incidunt exercitationem quod in beatae! Minima
                quaerat laborum esse deleniti illo, corrupti expedita cum maxime
                nesciunt nemo officia. Ipsum mollitia maiores dicta quidem quia
                exercitationem! Voluptatem dolor est voluptates veniam labore
                aspernatur nisi quidem perspiciatis. Maxime facilis beatae id
                iusto rem autem molestiae amet, iure incidunt nemo nihil nisi at
                doloremque dolor itaque modi minus assumenda quis dolores
                pariatur aperiam tenetur quaerat? Facere, officiis laboriosam?
                Consequatur soluta aliquam repudiandae nemo nostrum eos neque
                vitae laboriosam ullam iste necessitatibus, deserunt quas,
                repellat doloribus iure temporibus? Temporibus, explicabo! Velit
                sed aspernatur perspiciatis quam rerum deserunt facere ratione!
                Ratione accusantium voluptas aliquid ad perspiciatis asperiores
                cupiditate eaque blanditiis aliquam reiciendis alias soluta
                omnis, inventore atque qui laudantium hic nobis maxime dolorum
                nesciunt. Quod itaque veritatis odio provident aliquid. Ipsum,
                quis obcaecati aut fugit repellendus alias doloremque libero
                sapiente corrupti vitae voluptate possimus laborum quasi atque
                ex nesciunt adipisci deserunt blanditiis esse reprehenderit ut
                officia natus animi. Eveniet, fugit! Saepe molestiae, quis vitae
                suscipit, veniam deserunt aliquam sapiente eos, optio aliquid ad
                dolorem maiores quod distinctio delectus. Consequatur, enim
                nisi. Quod ea iure minus officia sint architecto qui beatae!
                Pariatur, natus omnis! Blanditiis id labore suscipit ipsa, at
                iusto esse tempore, ratione cumque deleniti odit! Doloremque,
                delectus ducimus fugit perferendis dolor vitae nemo veritatis
                doloribus tenetur? A, dolore excepturi! Amet maxime, eveniet
                omnis molestias veniam sint ullam fugit incidunt delectus harum
                esse perspiciatis possimus doloremque, illo dolores qui
                repudiandae dignissimos placeat? Corporis similique voluptas non
                nesciunt nobis hic quis. Odit recusandae ut, dolorum voluptatem
                asperiores alias, similique neque corrupti excepturi veritatis
                repellendus quidem nisi voluptates vel atque praesentium?
                Architecto iusto exercitationem sequi eveniet iste? Nulla minima
                modi porro voluptates.
            </section>
        </div>
    );
}
