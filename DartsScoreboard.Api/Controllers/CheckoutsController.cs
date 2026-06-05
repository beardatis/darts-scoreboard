using DartsScoreboard.Application.Checkouts;
using DartsScoreboard.Application.DTOs.Checkouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DartsScoreboard.Api.Controllers;

[ApiController]
[Route("api/checkouts")]
[Authorize]
public class CheckoutsController : ControllerBase
{
    [HttpGet("{remainingScore:int}")]
    public ActionResult<CheckoutResponse> GetCheckout(
        int remainingScore)
    {
        Dictionary<int, string> checkouts =
            CheckoutTable.Checkouts;

        if (remainingScore > 170 || remainingScore < 2)
        {
            return Ok(new CheckoutResponse
            {
                RemainingScore = remainingScore,
                IsCheckoutPossible = false,
                Suggestion = null
            });
        }

        if (!checkouts.TryGetValue(
                remainingScore,
                out string? suggestion))
        {
            return Ok(new CheckoutResponse
            {
                RemainingScore = remainingScore,
                IsCheckoutPossible = false,
                Suggestion = null
            });
        }

        return Ok(new CheckoutResponse
        {
            RemainingScore = remainingScore,
            IsCheckoutPossible = true,
            Suggestion = suggestion
        });
    }
}