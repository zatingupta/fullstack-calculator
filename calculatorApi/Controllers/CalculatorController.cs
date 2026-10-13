using Microsoft.AspNetCore.Mvc;
using calculatorApi.Models;

namespace calculatorApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalculatorController : ControllerBase
{
    [HttpPost("calculate")]
    public ActionResult<CalculationResponse> Calculate([FromBody] CalculationRequest request)
    {
        double result = 0;
        string symbol = "";

        switch (request.Operation.ToLower())
        {
            case "add":
                result = request.Num1 + request.Num2;
                symbol = "+";
                break;
            case "subtract":
                result = request.Num1 - request.Num2;
                symbol = "-";
                break;
            case "multiply":
                result = request.Num1 * request.Num2;
                symbol = "×";
                break;
            case "divide":
                if (request.Num2 == 0)
                {
                    return Ok(new CalculationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Cannot divide by zero"
                    });
                }
                result = request.Num1 / request.Num2;
                symbol = "÷";
                break;
            default:
                return BadRequest(new CalculationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid operation"
                });
        }

        return Ok(new CalculationResponse
        {
            Result = result,
            Expression = $"{request.Num1} {symbol} {request.Num2}",
            IsSuccess = true
        });
    }
}