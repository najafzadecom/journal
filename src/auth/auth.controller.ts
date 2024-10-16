import {Controller, Post, Body} from '@nestjs/common';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('register')
    async register(@Body('username') username: string, @Body('password') password: string) {
        return this.authService.register(username, password);
    }

    @Post('login')
    async login(@Body('username') username: string, @Body('password') password: string) {
        const token = await this.authService.validateUser(username, password);
        if (!token) {
            return {message: 'Invalid credentials'};
        }
        return {access_token: token};
    }
}