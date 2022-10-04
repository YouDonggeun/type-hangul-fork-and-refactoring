// Reference

import merge from "lodash.merge"

type GetObjDifferentKeys<
    T,
    U,
    T0 = Omit<T, keyof U> & Omit<U, keyof T>,
    T1 = {
        [K in keyof T0]: T0[K]
    }
> = T1
type GetObjSameKeys<T, U> = Omit<T | U, keyof GetObjDifferentKeys<T, U>>

type MergeTwoObjects<
    T,
    U,
    // non shared keys are optional
    T0 = Partial<GetObjDifferentKeys<T, U>>
    // shared keys are recursively resolved by `DeepMergeTwoTypes<...>`
    & { [K in keyof GetObjSameKeys<T, U>]: DeepMergeTwoTypes<T[K], U[K]> },
    T1 = { [K in keyof T0]: T0[K] }
> = T1

type Head<T> = T extends [infer I, ...infer _Rest] ? I : never
type Tail<T> = T extends [infer _I, ...infer Rest] ? Rest : never


type Zip_DeepMergeTwoTypes<T, U> = T extends []
    ? U
    : U extends []
    ? T
    : [
        DeepMergeTwoTypes<Head<T>, Head<U>>,
        ...Zip_DeepMergeTwoTypes<Tail<T>, Tail<U>>
    ]
export type DeepMergeTwoTypes<T, U> =
    // ----- 2 added lines ------
    // this line ⏬
    [T, U] extends [any[], any[]]
    // ... and this line ⏬
    ? Zip_DeepMergeTwoTypes<T, U>
    // check if generic types are objects
    : [T, U] extends [{ [key: string]: unknown }, { [key: string]: unknown }]
    ? MergeTwoObjects<T, U>
    : T | U

export function _merge<T, U>(obj1: T, obj2: U): DeepMergeTwoTypes<T, U> {
    return merge(obj1, obj2) as DeepMergeTwoTypes<T, U>
}