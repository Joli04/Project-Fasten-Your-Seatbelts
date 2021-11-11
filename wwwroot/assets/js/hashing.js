export class hashing{
    /**
     *
     *
     * @param rawPassword
     * @param { object } [options={}] - object containing salt and rounds
     * @returns {string}
     */
   static hash(rawPassword, options = {}) {

        /**
         * salt is optional, if not provided it will be set to current timestamp
         */
        const salt = options.salt ? options.salt : new Date().getTime();

        /**
         * rounds is optional, if not provided it will be set to 10
         */
        const rounds = options.rounds ? options.rounds : 10;

        let hashed =  md5(rawPassword + salt);
        for (let i = 0; i <= rounds; i++) {
            hashed = md5(hashed);
        }
        return `${salt}$${rounds}$${hashed}`;
    }

    /**
     *
     *
     * @param {string} rawPassword - the raw password
     * @param { string } hashedPassword - the hashed password
     * @returns
     */
    static compare(rawPassword, hashedPassword) {
        try {
            const [ salt, rounds ] = hashedPassword.split('$');
            const hashedRawPassword = this.hash(rawPassword, { salt, rounds });
            return hashedPassword === hashedRawPassword;
        } catch (error) {
            throw Error(error.message);
        }
    }
};