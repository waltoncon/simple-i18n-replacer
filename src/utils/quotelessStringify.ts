function quotelessStringify(value: string) {
    return JSON.stringify(value).replaceAll(/(^"|"$)/g, '');
}

export default quotelessStringify;
