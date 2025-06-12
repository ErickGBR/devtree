import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const checkPassword = async (password: string, hash: string): Promise<boolean> => {
    const result = await bcrypt.compare(password, hash);

    console.log("result ----------- ", result)
    return result;
}