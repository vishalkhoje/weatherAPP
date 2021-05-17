const debounce = (fun: Function, delay: number) => {
    let debounceTimer: number;
    return (...args: any) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(
            () =>
                (debounceTimer = setTimeout(
                    () => fun.apply(this, args),
                    delay,
                )),
        );
    };
};

export {debounce};
