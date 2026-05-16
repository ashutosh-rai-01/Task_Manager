export const getZoderror = (errors) =>{
    if (!errors) return {};
    const newerror = {}
    errors.forEach(err => {
        
        newerror[err.path[0]] = err.message
    });
    return newerror;
}