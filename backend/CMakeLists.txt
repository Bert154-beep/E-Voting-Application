cmake_minimum_required(VERSION 3.16)
project(EVOTINGAPP LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


include(FetchContent)

FetchContent_Declare(
    asio
    GIT_REPOSITORY https://github.com/chriskohlhoff/asio.git
    GIT_TAG asio-1-30-2
)
FetchContent_MakeAvailable(asio)
set(ASIO_INCLUDE_DIR ${asio_SOURCE_DIR}/asio/include)

FetchContent_Declare(
    Crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG v1.2.0
)
set(CROW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(CROW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(Crow)

include_directories(${ASIO_INCLUDE_DIR})


add_executable(EVOTINGAPP
    main.cpp
    e_voting.cpp
    e_voting.h
)


if(WIN32)
    target_link_libraries(EVOTINGAPP
        PRIVATE
        Crow::Crow
        ws2_32
        wsock32
        odbc32
    )
else()
    target_link_libraries(EVOTINGAPP
        PRIVATE
        Crow::Crow
        odbc
    )
endif()

set_target_properties(EVOTINGAPP PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)
