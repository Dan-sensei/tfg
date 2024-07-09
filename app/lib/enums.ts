export enum TFGStatus  {
    DRAFT = 1,
    SENT_FOR_REVIEW,
    PUBLISHED,
}

export const TFGStatusText = {
    [TFGStatus.DRAFT]: "DRAFT",
    [TFGStatus.SENT_FOR_REVIEW]: "SENT FOR REVIEW",
    [TFGStatus.PUBLISHED]: "PUBLISHED",
}

export enum Role  {
    STUDENT = 1,
    TUTOR,
    MANAGER,
    ADMIN,
}