export interface WithExtensions<T> {
  extensions?: T;
}

export namespace Extensions {
  export function updateResource<T extends WithExtensions<any>>(resource: T, newProperties: Partial<T>) {
    const { extensions, ...oldProperties } = resource;
    return {
      ...oldProperties,
      ...newProperties,
      extensions
    }
  }

  export function updateExtensions<T extends WithExtensions<any>>(resource: T, newExtensions: Partial<T['extensions']>): T {
    const { extensions: oldExtensions, ...resourceProperties } = resource;
    return {
      ...resourceProperties,
      extensions: {
        ...oldExtensions,
        ...newExtensions
      }
    } as T;
  }
}