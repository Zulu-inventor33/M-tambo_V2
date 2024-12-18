from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from account.models import Developer
from .models import Building
from .serializers import BuildingSerializer


class AddBuildingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Retrieve developer_id from the request data
        developer_id = request.data.get('developer_id')

        # Ensure developer_id is provided
        if not developer_id:
            return Response({'error': 'Developer ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to fetch the Developer object using the provided developer_id
        try:
            developer = Developer.objects.get(id=developer_id)
        except Developer.DoesNotExist:
            return Response({'error': f'Developer with ID {developer_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Add developer-related information to the request data
        request.data['developer'] = developer.id
        request.data['developer_name'] = developer.developer_name

        # Attempt to validate and save the building data
        serializer = BuildingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return errors if serializer validation fails
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ListBuildingsView(APIView):
    permission_classes = [AllowAny]  # You can update this to a more restrictive permission if needed

    def get(self, request):
        # Retrieve all buildings from the database
        buildings = Building.objects.all()

        # Serialize the buildings using the BuildingSerializer
        serializer = BuildingSerializer(buildings, many=True)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetBuildingDetailsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, building_id):
        try:
            # Try to fetch the building using the provided building_id
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            # If the building doesn't exist, return a 404 error
            return Response({"error": "Building not found."}, status=status.HTTP_404_NOT_FOUND)

        # If the building is found, return the building details
        serializer = BuildingSerializer(building)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetBuildingsByDeveloperView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, developer_id):
        try:
            # Fetch all buildings that belong to the specified developer
            buildings = Building.objects.filter(developer_id=developer_id)

            # If no buildings are found for the developer
            if not buildings:
                return Response({"error": "No buildings found for this developer."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the list of buildings
            serializer = BuildingSerializer(buildings, many=True)

            # Return the serialized buildings data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle unexpected errors (e.g., invalid developer_id or other issues)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

