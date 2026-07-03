import authService from "../services/auth.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const data = await authService.login(
        email,
        password
    );

    res.cookie(
        "refreshToken",
        data.refreshToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            {
                employee: data.employee,
                accessToken: data.accessToken,
            }
        )
    );

});