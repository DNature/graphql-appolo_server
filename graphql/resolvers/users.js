const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const {
    validateRegisterInput,
    validateLoginInput
} = require('../../util/validators');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../../config');
const { generateToken } = require('../../util/generateToken');

module.exports = {
    Mutation: {
        // * Login User
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User Does not Exits', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong Password';
                throw new UserInputError('Wrong Credentials', { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },

        //* Register New User
        async register(
            _, {
                registerInput: { username, email, password, confirmPassword }
            }
        ) {
            //  Validate User data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }

            //? Hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();
            const token = generateToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};