import * as v from "valibot";
import { MAX_DEFENSE_TITLE_LENGTH, MAX_SOCIAL_LINK_LENGTH } from "../types/defaultData";

export enum Social {
    github = "github",
    linkedin = "linkedin",
    twitter = "twitter",
    youtube = "youtube",
    discord = "discord",
    facebook = "facebook",
}

export type SocialsType = v.InferInput<typeof SocialsSchema>;

const SocialValueSchema = v.nullable(v.pipe(v.string(), v.nonEmpty(), v.maxLength(MAX_SOCIAL_LINK_LENGTH)));

export const SocialsSchema = v.object({
    [Social.github]: SocialValueSchema,
    [Social.linkedin]: SocialValueSchema,
    [Social.twitter]: SocialValueSchema,
    [Social.youtube]: SocialValueSchema,
    [Social.discord]: SocialValueSchema,
    [Social.facebook]: SocialValueSchema,
});

// Id will be converted to number, if it returns NaN fail validation
export const IdSchema = v.pipe(v.unknown(), v.transform(Number), v.number("Id inválido"));

export const PaginationSchema = v.object({
    currentPage: v.fallback(v.pipe(v.unknown(), v.transform(Number), v.number(), v.toMinValue(1)), 1),
    totalElements: v.pipe(v.unknown(), v.transform(Number), v.number()),
    id: IdSchema
});

export const UserProfileSchema = v.object({
    showImage: v.boolean(),
    socials: SocialsSchema,
    personalPage: SocialValueSchema,
});

export const LocationSchema = v.object({
    id: v.number("Id de ubicación inválido"),
    name: v.pipe(v.string(), v.nonEmpty("El nombre de la ubicación no puede estar vacío")),
    mapLink: v.nullable(v.string()),
});

export const DefenseDataSchema = v.object({
    id: v.number("Id inválido"),
    collegeId: v.number("Id de universidad inválido"),
    title: v.pipe(
        v.string(),
        v.nonEmpty("El título no puede estar vacío"),
        v.maxLength(MAX_DEFENSE_TITLE_LENGTH, `El título debe tener menos de ${MAX_DEFENSE_TITLE_LENGTH} caracteres`)
    ),
    startTime: v.date("Fecha de inicio inválida"),
    endTime: v.date("Fecha de fin inválida"),
    location: LocationSchema,
});

export const YearMonthSchema = v.object({
    year: v.fallback(v.number(), new Date().getFullYear()),
    month: v.fallback(v.pipe(v.number(), v.minValue(1), v.maxValue(12)), new Date().getMonth() + 1),
});

export const DeleteSchema = v.object({
    targetId: v.number("Id inválido"),
    fallbackId: v.nullable(v.number()),
});
