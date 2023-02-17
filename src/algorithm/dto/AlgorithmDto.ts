import {AlgType} from "../algorithm.model";

export interface AlgorithmDto {
    name: string,
    type: AlgType,
    media?: string[],
}
