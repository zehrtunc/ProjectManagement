namespace ProjectManagement.Models.Common
{
    public class Result
    {
        public string Message { get; set; }
        public bool Success { get; set; }

        public static Result Ok(string message = "İşlem başarılı.")
        {
            return new Result { Success = true, Message = message };
        }

        public static Result Fail(string message = "İşlem başarısız.")
        {
            return new Result { Success = false, Message = message };
        }
    }
}
