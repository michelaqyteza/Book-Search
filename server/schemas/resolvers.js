const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id }).populate('savedBooks');
			}
			throw new AuthenticationError('You need to be logged in!');
		},
	},
	Mutation: {
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError('No user found with this email address');
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = signToken(user);

			return { token, user };
		},
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (parent, args, context) => {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $addToSet: { savedBooks: { ...args } } }
			)
			return updatedUser;
		},
		removeBook: async (parent, { bookId }, context) => {
			const updatedUser = await user.findOneAndUpdate(
				{ _id: context.user._id },
				{ $pull: { savedBooks: { bookId: bookId } } }
			)
		}

	}
}
module.exports = resolvers;