using BCrypt.Net;
using BusinessObject;
using BusinessObject.Dtos.Auth;
using Repository;
using Service.JWT;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Service
{       
    // Business logic:
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        public UserService(IUserRepository userRepository, IJwtService jwtService )
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }
        

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                throw new Exception("Invalid credentials");

            return _jwtService.GenerateToken(user);
        }

        public async Task<string> RegisterAsync(RegisterDto registerDto)
        {
            var emailExists = await _userRepository.EmailExistsAsync(registerDto.Email);
            if (emailExists)
            {
                throw new Exception("Email already exists");
            }
            
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "User" // Default role
            };
           await _userRepository.CreateAsync(user);
            return "Registration successful. Please log in.";
        }
    }
}
