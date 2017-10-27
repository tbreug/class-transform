import { ClassTransformer } from "./ClassTransformer";
import { defaultMetadataStorage } from "./storage";
import { TypeMetadata } from "./metadata/TypeMetadata";
import { ExposeMetadata } from "./metadata/ExposeMetadata";
import { ExcludeMetadata } from "./metadata/ExcludeMetadata";
import { TransformMetadata } from "./metadata/TransformMetadata";
/**
 * Defines a custom logic for value transformation.
 */
export function Transform(transformFn, options) {
    return function (target, key) {
        var metadata = new TransformMetadata(target.constructor, key, transformFn, options);
        defaultMetadataStorage.addTransformMetadata(metadata);
    };
}
/**
 * Specifies a type of the property.
 */
export function Type(typeFunction) {
    return function (target, key) {
        var type = Reflect.getMetadata("design:type", target, key);
        var metadata = new TypeMetadata(target.constructor, key, type, typeFunction);
        defaultMetadataStorage.addTypeMetadata(metadata);
    };
}
/**
 * Marks property as included in the process of transformation. By default it includes the property for both
 * constructorToPlain and plainToConstructor transformations, however you can specify on which of transformation types
 * you want to skip this property.
 */
export function Expose(options) {
    return function (object, propertyName) {
        var metadata = new ExposeMetadata(object instanceof Function ? object : object.constructor, propertyName, options || {});
        defaultMetadataStorage.addExposeMetadata(metadata);
    };
}
/**
 * Marks property as excluded from the process of transformation. By default it excludes the property for both
 * constructorToPlain and plainToConstructor transformations, however you can specify on which of transformation types
 * you want to skip this property.
 */
export function Exclude(options) {
    return function (object, propertyName) {
        var metadata = new ExcludeMetadata(object instanceof Function ? object : object.constructor, propertyName, options || {});
        defaultMetadataStorage.addExcludeMetadata(metadata);
    };
}
/**
 * Transform the object from class to plain object and return only with the exposed properties.
 */
export function TransformClassToPlain(params) {
    return function (target, propertyKey, descriptor) {
        var classTransformer = new ClassTransformer();
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = originalMethod.apply(this, args);
            var isPromise = !!result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function";
            return isPromise ? result.then(function (data) { return classTransformer.classToPlain(data, params); }) : classTransformer.classToPlain(result, params);
        };
    };
}
/**
 * Return the class instance only with the exposed properties.
 */
export function TransformClassToClass(params) {
    return function (target, propertyKey, descriptor) {
        var classTransformer = new ClassTransformer();
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = originalMethod.apply(this, args);
            var isPromise = !!result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function";
            return isPromise ? result.then(function (data) { return classTransformer.classToClass(data, params); }) : classTransformer.classToClass(result, params);
        };
    };
}
//# sourceMappingURL=decorators.js.map