<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|regex:/^\+?[0-9]{10,}$/',
        ]);

        $user = $this->authService->register($validated);

        return response()->json([
            'message' => 'Registration successful. Please verify your email.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !password_verify($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email first.',
                'user_id' => $user->id,
            ], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::find($request->user_id);

        if ($this->authService->verifyOtp($user, $request->otp)) {
            return response()->json(['message' => 'Email verified successfully']);
        }

        return response()->json(['message' => 'Invalid or expired OTP'], 400);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $user = User::where('email', $request->email)->first();
        $this->authService->sendOtpEmail($user);

        return response()->json(['message' => 'OTP sent to your email']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users']);

        $user = User::where('email', $request->email)->first();
        $this->authService->sendPasswordResetEmail($user);

        return response()->json(['message' => 'Password reset link sent to your email']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
