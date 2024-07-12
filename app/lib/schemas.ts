import * as v from "valibot";
import { MAX_DEFENSE_TITLE_LENGTH } from "../types/defaultData";


export const LocationSchema = v.object({
    id: v.number("Id de ubicación inválido"),
    name: v.pipe(v.string(), v.nonEmpty("El nombre de la ubicación no puede estar vacío")),
    mapLink: v.nullable(v.string()),
})

export const DefenseDataSchema = v.object({
    id: v.number("Id inválido"),
    collegeId: v.number("Id de universidad inválido"),
    title: v.pipe(v.string(), v.nonEmpty("El título no puede estar vacío"), v.maxLength(MAX_DEFENSE_TITLE_LENGTH, `El título debe tener menos de ${MAX_DEFENSE_TITLE_LENGTH} caracteres`)),
    startTime: v.date("Fecha de inicio inválida"),
    endTime: v.date("Fecha de fin inválida"),
    location: LocationSchema,
});


export const YearMonthSchema = v.object({
    year: v.fallback(v.number(), new Date().getFullYear()),
    month: v.fallback(v.pipe(v.number(), v.minValue(1), v.maxValue(12)), new Date().getMonth() + 1),
});
