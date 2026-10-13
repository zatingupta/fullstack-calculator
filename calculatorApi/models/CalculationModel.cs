namespace calculatorApi.Models;

public class CalculationRequest
{
    public double Num1 { get; set; }
    public double Num2 { get; set; }
    public string Operation { get; set; } = string.Empty;
}

public class CalculationResponse
{
    public double Result { get; set; }
    public string Expression { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
    public bool IsSuccess { get; set; } = true;
}