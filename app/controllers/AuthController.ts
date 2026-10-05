import { NextResponse } from 'next/server';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login(req: Request) {
    try {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' }, 
          { status: 400 }
        );
      }

      const student = await this.authService.authenticateStudent(email, password);

      if (!student) {
        return NextResponse.json(
          { error: 'Invalid email or password' }, 
          { status: 401 }
        );
      }

      // Success: Return the student data
      return NextResponse.json(
        { message: 'Login successful', user: student }, 
        { status: 200 }
      );

    } catch (error) {
      console.error('Login Error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' }, 
        { status: 500 }
      );
    }
  }
}