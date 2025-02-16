from django.conf import settings
from django.http import HttpRequest
import logging
import base64
import requests
from datetime import datetime
from brokers.models import BrokerUser

logger = logging.getLogger(__name__)

class MpesaBase:
    """
    Base class for M-PESA interactions.
    Handles authentication and token management.
    """
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.api_url = settings.MPESA_API_URL

    def get_access_token(self):
        """
        Obtain the access token required for M-PESA API requests.
        """
        try:
            credentials = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
            headers = {
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/json"
            }
            response = requests.get(self.api_url, headers=headers)

            if response.status_code == 200:
                response_data = response.json()
                return response_data.get('access_token')
            else:
                logger.error(f"Failed to retrieve access token: {response.text}")
                return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Error requesting access token: {e}")
            return None


class MpesaSTKPush(MpesaBase):
    """
    Handles M-PESA STK Push (CustomerPayBillOnline) transactions.
    """
    def __init__(self, expected_payment_id: int, request: HttpRequest):
        super().__init__()
        self.expected_payment_id = expected_payment_id
        self.business_shortcode = settings.MPESA_BUSINESS_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
        self.callback_url = settings.MPESA_CALLBACK_URL.format(expected_payment_id=expected_payment_id)
        self.lipa_na_mpesa_online_url = settings.MPESA_LIPA_NA_MPESA_URL

    def initiate_payment(self, amount, phone_number, account_reference, transaction_description):
        """
        Initiate M-PESA STK push request.
        """
        access_token = self.get_access_token()
        if not access_token:
            return {'status': 'failed', 'message': 'Unable to fetch access token.'}

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }

        # Format the phone number before using it in the payload
        phone_number = format_phone_number(phone_number)
        if not phone_number:
            return {'status': 'failed', 'message': 'Invalid phone number format.'}

        amount = round(amount)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(f"{self.business_shortcode}{self.passkey}{timestamp}".encode()).decode()

        callback_url = self._generate_callback_url(self.expected_payment_id)
        payload = {
            "BusinessShortCode": self.business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": self.business_shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_description
        }

        logger.debug(f"Sending payment request: {payload}")

        try:
            response = requests.post(self.lipa_na_mpesa_online_url, json=payload, headers=headers)
            logger.debug(f"Response from M-PESA API: {response.json()}")

            if response.status_code == 200:
                response_data = response.json()
                if response_data.get("ResponseCode") == "0":
                    return {'status': 'success', 'message': 'Payment initiated successfully', 'data': response_data}
                else:
                    logger.error(f"Failed to initiate payment: {response_data}")
                    return {'status': 'failed', 'message': f"Failed: {response_data.get('errorMessage')}"}
            else:
                logger.error(f"Error initiating payment via M-PESA: {response.json()}")
                return {'status': 'failed', 'message': f"Error: {response.json()}"}
        except requests.exceptions.RequestException as e:
            logger.error(f"Error initiating M-PESA payment: {str(e)}")
            return {'status': 'failed', 'message': f"Exception: {str(e)}"}
        
    def _generate_callback_url(self, expected_payment_id):
        """
        Helper function to generate callback URL.
        """
        callback_url = settings.MPESA_CALLBACK_URL.format(expected_payment_id=expected_payment_id)
        print(callback_url)
        return callback_url


class MpesaB2C(MpesaBase):
    """
    M-PESA Daraja B2C Integration
    """
    def initiate_b2c_payment(self, phone_number, amount, broker_id):
        """
        Initiates a B2C payment via M-PESA Daraja API
        """
        access_token = self.get_access_token()
        if not access_token:
            return {'status': 'failed', 'message': 'Unable to fetch access token.'}

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        # Format the phone number before using it in the payload
        phone_number = format_phone_number(phone_number)
        if not phone_number:
            return {'status': 'failed', 'message': 'Invalid phone number format.'}

        callback_url = settings.MPESA_B2C_CALLBACK_URL.format(broker_id=broker_id)
        payload = {
            "InitiatorName": settings.MPESA_B2C_INITIATOR_NAME,
            "SecurityCredential": settings.MPESA_B2C_SECURITY_CREDENTIAL,
            "CommandID": settings.MPESA_B2C_COMMAND_ID,
            "Amount": amount,
            "PartyA": settings.MPESA_B2C_PARTY_A,
            "PartyB": phone_number,
            "Remarks": "Broker Withdrawal",
            "QueueTimeOutURL": callback_url,
            "ResultURL": callback_url,
            "Occasion": "Broker Withdrawal"
        }

        logger.debug(f"Sending B2C payment request: {payload}")

        try:
            response = requests.post(settings.MPESA_B2C_API_URL, json=payload, headers=headers)
            logger.debug(f"Response from M-PESA API: {response.json()}")

            if response.status_code == 200:
                response_data = response.json()
                if response_data.get("ResponseCode") == "0":
                    return {'status': 'success', 'message': 'B2C Payment initiated successfully', 'data': response_data}
                else:
                    logger.error(f"Failed to initiate B2C payment: {response_data}")
                    return {'status': 'failed', 'message': f"Failed: {response_data.get('errorMessage')}"}
            else:
                logger.error(f"Error initiating B2C payment via M-PESA: {response.json()}")
                return {'status': 'failed', 'message': f"Error: {response.json()}"}
        except requests.exceptions.RequestException as e:
            logger.error(f"Error initiating M-PESA B2C payment: {str(e)}")
            return {'status': 'failed', 'message': f"Exception: {str(e)}"}


def format_phone_number(phone_number: str) -> str:
    """
    Format phone number to international format for M-PESA.
    """
    if phone_number.startswith('0'):
        return '254' + phone_number[1:]
    elif phone_number.startswith('+254'):
        return phone_number.replace('+', '')
    elif phone_number.startswith('254'):
        return phone_number
    else:
        logger.error(f"Invalid phone number format: {phone_number}")
        return None
