using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DartsScoreboard.Api.Controllers;

[ApiController]
[Route("api/secure-test")]
[Authorize]
public class SecureTestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("JWT működik, be vagy jelentkezve.");
    }
} 