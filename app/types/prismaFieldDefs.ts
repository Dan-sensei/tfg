export const tfgFields = {
    id: true,
    thumbnail: true,
    title: true,
    description: true,
    views: true,
    score: true,
    pages: true,
    createdAt: true,
};

export const tfgTopFields = {
    id: true,
    banner: true,
    title: true,
    description: true,
    views: true,
    score: true,
};

export const tfgFullFields = {
    id: true,
    thumbnail: true,
    banner: true,
    title: true,
    description: true,
    author: true,
    tutor: {
        select:{
            name: true,
            link: true
        }
    },
    department: {
        select:{
            name: true,
            link: true
        }
    },
    content: true,
    pages: true,
    documentLink: true,
    tags: true,
    views: true,
    score: true,
    createdAt: true,
    college: {
        select: {
            name: true,
            image: true
        }
    }
}
