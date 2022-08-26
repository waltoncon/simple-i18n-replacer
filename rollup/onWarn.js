import nodePath from 'path';

function onWarn(config = {}) {
    const { skip = [] } = config;

    return (warning, rollupWarn) => {
        // only show warning when code and path don't match
        // anything in skip list of ignored warnings
        const skippableWarning = skip.some(({ code, path }) => {
            return warning.code === code
                && warning.importer.includes(nodePath.normalize(path));
        });

        if (!skippableWarning) {
            rollupWarn(warning);
        }
    };
}

export default onWarn;
