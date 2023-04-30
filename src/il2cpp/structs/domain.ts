namespace Il2Cpp {
    @recycle
    export class Domain extends NonNullNativeStruct {
        /** Gets the assemblies that have been loaded into the execution context of the application domain. */
        @lazy
        get assemblies(): Il2Cpp.Assembly[] {
            let handles = readNativeList(_ => Il2Cpp.api.domainGetAssemblies(this, _));

            if (handles.length == 0) {
                const assemblyObjects = this.object.method<Il2Cpp.Array<Il2Cpp.Object>>("GetAssemblies").overload().invoke();
                handles = globalThis.Array.from(assemblyObjects).map(_ => _.field<NativePointer>("_mono_assembly").value);
            }

            return handles.map(_ => new Il2Cpp.Assembly(_));
        }

        /** Gets the encompassing object of the application domain. */
        @lazy
        get object(): Il2Cpp.Object {
            return new Il2Cpp.Object(Il2Cpp.api.domainGetObject());
        }

        /** Opens and loads the assembly with the given name. */
        assembly(name: string): Il2Cpp.Assembly {
            return this.tryAssembly(name) ?? raise(`couldn't find assembly ${name}`);
        }

        /** Attached a new thread to the application domain. */
        attach(): Il2Cpp.Thread {
            return new Il2Cpp.Thread(Il2Cpp.api.threadAttach(this));
        }

        /** Opens and loads the assembly with the given name. */
        tryAssembly(name: string): Il2Cpp.Assembly | null {
            const handle = Il2Cpp.api.domainAssemblyOpen(this, Memory.allocUtf8String(name));
            return handle.isNull() ? null : new Il2Cpp.Assembly(handle);
        }
    }

    /** Gets the application domain. */
    export declare const domain: Il2Cpp.Domain;
    // prettier-ignore
    getter(Il2Cpp, "domain", () => {
        return new Il2Cpp.Domain(Il2Cpp.api.domainGet());
    }, lazy);
}
