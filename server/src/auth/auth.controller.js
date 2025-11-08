import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function login(req, res) {
    const { username, password } = req.body;
}