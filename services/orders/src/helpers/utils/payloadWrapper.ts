export const stringifyPayload = (payload: object) => {
    return JSON.stringify(payload);
}

export const parsePayload = (payload: string | undefined) => {
    return JSON.parse(payload || "{}");
}
