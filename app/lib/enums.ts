export enum TFGStatus {
    DRAFT = 1,
    SENT_FOR_REVIEW,
    PUBLISHED,
}

export const TFGStatusText = {
    [TFGStatus.DRAFT]: {
        text: "BORRADOR",
        color: "text-yellow-500",
    },
    [TFGStatus.SENT_FOR_REVIEW]: {
        text: "EN REVISIÓN",
        color: "text-teal-500",
    },
    [TFGStatus.PUBLISHED]: {
        text: "PUBLICADO",
        color: "text-green-500",
    },
};

export enum Role {
    STUDENT = 1,
    TUTOR,
    MANAGER,
    ADMIN,
}
