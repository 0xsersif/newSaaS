<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthService
{
    public function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone' => $data['phone'],
            'role' => $data['role'] ?? 'STORE_OWNER',
        ]);

        $this->sendOtpEmail($user);

        return $user;
    }

    public function sendOtpEmail(User $user): void
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        Mail::raw("Your OTP code is: {$otp}", function ($message) use ($user) {
            $message->to($user->email)->subject('Email Verification Code');
        });
    }

    public function verifyOtp(User $user, string $otp): bool
    {
        if ($user->otp_code !== $otp) {
            return false;
        }

        if ($user->otp_expires_at?->isPast()) {
            return false;
        }

        $user->update([
            'email_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        return true;
    }

    public function sendPasswordResetEmail(User $user): void
    {
        $token = Str::random(60);
        
        Mail::raw("Password reset link: " . url("/reset-password?token={$token}&email={$user->email}"), function ($message) use ($user) {
            $message->to($user->email)->subject('Password Reset Request');
        });
    }
}
