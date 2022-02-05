/** @internal */
export function filterMapArray<V, U>(source: V[], filter: (value: V) => boolean, map: (value: V) => U): U[] {
    const dest: U[] = [];

    for (const value of source) {
        if (filter(value)) {
            dest.push(map(value));
        }
    }

    return dest;
}

/** @internal */
export function mapToArray<V, U>(source: V[], map: (value: V) => U): U[] {
    const dest: U[] = [];

    for (const value of source) {
        dest.push(map(value));
    }

    return dest;
}

/** @internal */
export function overridePropertyValue<T extends object, K extends keyof T>(target: T, property: K, value: T[K]): T {
    Reflect.defineProperty(target, property, { value: value });
    return target;
}

/** @internal */
export function formatNativePointer(nativePointer: NativePointer): string {
    return `0x${nativePointer.toString(16).padStart(8, "0")}`;
}

/** @internal */
export function getOrNull<T extends ObjectWrapper>(handle: NativePointer, Class: new (handle: NativePointer) => T): T | null {
    return handle.isNull() ? null : new Class(handle);
}

/** @internal */
export function makeArrayFromNativeIterator<T extends ObjectWrapper>(
    holder: NativePointerValue,
    nativeFunction: NativeFunction<NativePointer, [NativePointerValue, NativePointer]>,
    Class: new (handle: NativePointer) => T
): T[] {
    const iterator = Memory.alloc(Process.pointerSize);
    const array: T[] = [];

    let handle: NativePointer;

    while (!(handle = nativeFunction(holder, iterator)).isNull()) {
        array.push(new Class(handle));
    }

    return array;
}

/** @internal */
export function cacheInstances<T extends ObjectWrapper, U extends new (handle: NativePointer) => T>(Class: U) {
    const instanceCache = new Map<number, T>();

    return new Proxy(Class, {
        construct(Target: U, argArray: [NativePointer]): T {
            const handle = argArray[0].toUInt32();

            if (!instanceCache.has(handle)) {
                instanceCache.set(handle, new Target(argArray[0]));
            }
            return instanceCache.get(handle)!;
        }
    });
}

/** @internal */
export function memoize(_: any, __: string, descriptor: TypedPropertyDescriptor<(key: string) => any>) {
    if (descriptor.value != null) {
        const map = new Map<string, any>();
        const original = descriptor.value;

        descriptor.value = function (key: string): any {
            if (!map.has(key)) {
                const result = original.call(this, key);
                if (result) {
                    map.set(key, result);
                }
            }
            return map.get(key)!;
        };
    }
}
