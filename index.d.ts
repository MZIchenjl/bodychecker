import * as express from 'express';

declare namespace bodychecker {
    interface Result {
        message: string,
        type: 'empty' | 'invalid',
        fieldpath: string,
        fieldvalue: any
    }
}

type Validator<T> = (body: object, fieldpath: string) => bodychecker.Result | null;
interface Requireable<T> extends Validator<T> {
    isRequired: Validator<T>;
}
type ValidationMap<T> = {[K in keyof T]?: Validator<T> };

interface Bodychecker {
    (checkOptions: { fieldName: Validator<any> }): express.RequestHandler;

    any: Requireable<any>;
    array: Requireable<any>;
    bool: Requireable<any>;
    number: Requireable<any>;
    object: Requireable<any>;
    string: Requireable<any>;

    oneof(values: any[]): Requireable<any>;
    oneoftype(checkers: Array<Validator<any>>): Requireable<any>;
    arrayof(checker: Validator<any>): Requireable<any>;
    objectof(checker: Validator<any>): Requireable<any>;
    shapeof(shape: ValidationMap<any>): Requireable<any>;
}

declare const bodychecker: Bodychecker;

export = bodychecker;

declare global {
    namespace Express {
        interface Request {
            $bcResult: bodychecker.Result | null
        }
    }
}
