function firstTrue(promises: Array<Promise<any>>): Promise<any> {
    const newPromises = promises.map(p => new Promise(
        (resolve, reject) => p.then(v => v && resolve(v), reject)
    ));

    newPromises.push(Promise.all(promises).then(() => false));

    return Promise.race(newPromises);
}

export { firstTrue }