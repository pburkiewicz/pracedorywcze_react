using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OddJobs.Models;

namespace OddJobs.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class RegisterModel : PageModel
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RegisterModel> _logger;
        private readonly IEmailSender _emailSender;

        public RegisterModel(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<RegisterModel> logger,
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _emailSender = emailSender;
        }

        public string ReturnUrl { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [EmailAddress]
        [Display(Name = "Email")]
        [JsonProperty(PropertyName = "Email")]
        [Remote("CheckUserExist", "Validation", HttpMethod = "POST",
            ErrorMessage = "Użytkownik o tym adresie już istnieje")]
        public string Email { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [StringLength(100, ErrorMessage = "The {0} musi posiadać minimalnie {2}, a maksymalnie {1} znaków",
            MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Hasło")]
        public string Password { get; set; }

        [BindProperty]
        [DataType(DataType.Password)]
        [Display(Name = "Powtórz hasło")]
        [Required(ErrorMessage = "Pole wymagane")]
        [Compare("Password", ErrorMessage = "Hasło i jego powtórzenie nie są takie smae")]
        public string ConfirmPassword { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [Display(Name = "Imię")]
        public string FirstName { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [Display(Name = "Nazwisko")]
        public string LastName { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [Display(Name = "Miasto")]
        public string City { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [Display(Name = "Ulica")]
        public string Street { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [Display(Name = "Numer domu")]
        
        [RegularExpression(@"^[0-9]*$", ErrorMessage = "Pole musi zawierać tylko cyfry")]
        public string HouseNumber { get; set; }

        [BindProperty]
        [Display(Name = "Numer mieszkania")]
        [RegularExpression(@"^[0-9]*$", ErrorMessage = "Pole musi zawierać tylko cyfry")]
        public string FlatNumber { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Pole wymagane")]
        [RegularExpression(@"^[0-9]{2}-[0-9]{3}$", ErrorMessage = "Pole musi zostać sformatowane ##-###")]
        [Display(Name = "Kod pocztowy")]
        public string ZipCode { get; set; }

        [BindProperty]
        [RegularExpression(@"^[0-9]{9}$", ErrorMessage = "Pole musi zawierać tylko cyfry")]
        [Required(ErrorMessage = "Pole wymagane")]
        [Display(Name = "Numer telefonu")]
        public string PhoneNumber { get; set; }

        public async Task OnGetAsync(string returnUrl = null)
        {
            ReturnUrl = returnUrl;
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = Email,
                    Email = Email,
                    FirstName = FirstName,
                    LastName = LastName,
                    City = City,
                    Street = Street,
                    HouseNumber = uint.Parse(HouseNumber),
                    FlatNumber = uint.Parse(FlatNumber),
                    ZipCode = ZipCode,
                    EmailConfirmed = true,
                    PhoneNumber = PhoneNumber
                };
                var result = await _userManager.CreateAsync(user, Password);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var callbackUrl = Url.Page(
                        "#",
                        pageHandler: null,
                        values: new {area = "Identity", userId = user.Id, code = code, returnUrl = returnUrl},
                        protocol: Request.Scheme);
                    //
                    // await _emailSender.SendEmailAsync(Input.Email, "Confirm your email",
                    //     $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        return Redirect("/");
                        // return RedirectToPage(returnUrl, new { email = Input.Email, returnUrl = returnUrl });
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}