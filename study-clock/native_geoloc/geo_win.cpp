#include "iostream"
#include <winrt/Windows.Foundation.h>
#include "winrt/windows.devices.geolocation.h"

using namespace winrt;
using namespace Windows::Devices::Geolocation;

int main(){
  init_apartment();

  Geolocator geolocator;
  auto accessStatus = Geolocator::RequestAccessAsync().get();

  if (accessStatus == GeolocationAccessStatus::Allowed) {
    auto pos = geolocator.GetGeopositionAsync().get();
    auto coord = pos.Coordinate().Point().Position();
    std::wcout << coord.Latitude << "," << coord.Longitude << "\n";
  } else {
    std::wcout << L"0\n";
  }

  return 0;
}